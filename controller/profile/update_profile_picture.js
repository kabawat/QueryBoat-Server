const { unlinkSync } = require('fs')
const { userModal } = require('..')
const path = require('path')
module.exports.update_profile_picture = async (req, res) => {
    try {
        const { email, username, status } = req?.email_data
        if (!status) {
            throw new Error('email not exists')
        }
        const rootDir = path.dirname(require.main.filename);
        if (req?.body?.image) {
            const update = await userModal.updateOne(
                { email: email },
                {
                    $set: {
                        profile_image: '/user/profile.png'
                    }
                }
            );
            if (update.modifiedCount !== 1) {
                throw new Error('profile picture not updated')
            }
            if (req?.body?.oldImage) {
                try {
                    const fileDir = path.join(rootDir, `public/${req?.body?.oldImage}`)
                    unlinkSync(fileDir)
                } catch (error) {
                    
                }
            }
        } else {
            const { profile } = req?.files;
            if (profile) {
                if (profile?.length) {
                    throw new Error('multiple files not allowed')
                }
                const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                const fileMimeType = profile.mimetype;

                if (!allowedFileTypes.includes(fileMimeType)) {
                    throw new Error('only image files are allowed');
                }

                const filename = `${username}-${new Date().getTime()}${path.extname(profile.name)}`
                const saveFile = path.join(rootDir, `public/user/${filename}`);
                const profile_image = `/user/${filename}`;
                const update = await userModal.updateOne(
                    { email: email },
                    {
                        $set: {
                            profile_image: profile_image
                        }
                    }
                );
                if (update.modifiedCount !== 1) {
                    throw new Error('profile picture not updated')
                }
                profile.mv(saveFile);
                if (req?.body?.oldImage) {
                    const fileDir = path.join(rootDir, `public/${req?.body?.oldImage}`)
                    unlinkSync(fileDir)
                }
            } else {
                throw new Error('image is required')
            }
        }
        res.status(200).json({
            status: true,
            message: 'profile picture update successful',
        })
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error.message
        })
    }
}
