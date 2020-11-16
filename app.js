var el = this.document.getElementById("content");
class Gamer {
    constructor(_name, _age) {
        this.name = _name;
        this.age = _age;
    }
}
var user = new Gamer("Tom", 29);
el.innerHTML = "Gamer: Name: " + user.name + " age: " + user.age;
//# sourceMappingURL=app.js.map