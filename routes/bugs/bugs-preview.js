module.exports =
    function displayBugsPreview(req, res){
      res.render('bugsPreviewView',{
          layout: false,
          content: req.body.preview
        });
    };
