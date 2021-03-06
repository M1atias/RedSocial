const ctrl = {};
const path = require('path');
const {randomNumber} = require('../helpers/libs');
const fs = require('fs-extra');

const {Image} = require('../models/index');

ctrl.index = async(req,res) =>{
    const image = await Image.findOne({filename: {$regex:req.params.image_id}});
    console.log(image);
    res.render('image',{image});
};

ctrl.create = (req,res) =>{

    const saveImage = async () => {
        const imageURL = randomNumber();
        const images = await Image.find({filename: imageURL});
        if (images.length > 0) {    
            saveImage();
        }else{
            console.log(imageURL);
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLowerCase();
            const targetPath = path.resolve(`src/public/upload/${imageURL}${ext}`)

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                await fs.rename(imageTempPath, targetPath);
                const newImg = new Image({
                    title: req.body.title,
                    filename: imageURL + ext,
                    description: req.body.description
                });
                const imageSaved = await newImg.save();
                res.redirect('/images/' + imageURL);
            } else{
                await fs.unlink(imageTempPath);
                res.status(500).json({error:'Only images are allowed'});
            }
        }
    };
    saveImage();
    
    
};

ctrl.like = (req,res) =>{
    
};

ctrl.comment = (req,res) =>{
    
};

ctrl.remove = (req,res) =>{
    
};




module.exports = ctrl;