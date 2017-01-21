function User(id, name, role) {
    this.id = id;
    this.name = name;
    this.role = role;
}

function Teacher(...args) {
    User.call(this, ...args);
}

function Student() {
    User.call(this, ...args);
}

Teacher.prototype = Object.create(User.prototype);
Teacher.prototype.constructor = Teacher;

Student.prototype = Object.create(User.prototype);
Student.prototype.constructor = Student;

module.exports = {
    TEACHER: Teacher,
    STUDENT: Student
};