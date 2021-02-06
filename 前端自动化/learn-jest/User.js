module.exports=class User{
    constructor(){
        this.name="";
    }
    setName(name){
        this.name=name;
    }
    getName(){
        return this.name;
    }
}