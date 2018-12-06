module.exports = {
  events(req, res, next){
    const event_json = JSON.parse(req.body);
    
    //Will implement web hooks at later date
    console.log(event_json);

    res.send(200);
  }
}