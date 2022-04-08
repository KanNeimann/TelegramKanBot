class ToDo {
    constructor(username) {
        this.toDos = []
    }

    getToDos() {
        return this.toDos
    }

    setTask(tarea) {
        this.toDos.push({
            Tarea: tarea,
            id: Date.now()
        })
    }
    deleteTask(taskToDelete) {
        this.toDos.map((task) => {
            if (task.id === taskToDelete.id) {
                this.toDos.splice(this.toDos.findIndex(task => task.id === taskToDelete.id), 1)
            }
        })
    }
}
module.exports = ToDo

/* const uss = new ToDo('Kan')

uss.setTask('Escribir un libro')
uss.setTask('Romper un libro')

uss.deleteTask(uss.getToDos()[0])

console.log(uss.getToDos())
 */