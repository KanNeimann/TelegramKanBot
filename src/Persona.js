class Persona {
    constructor(username) {
        this.username = username
        this.deudas = []
        this.toDos = []
    }
    getToDos() {
        return this.toDos
    }

    setTask(tarea) {
        this.toDos.push({
            tarea: tarea,
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
    getDeudas() {
        return this.deudas
    }
    setDeuda(deuda) {
        this.deudas.push({
            acreedor: deuda.acreedor,
            monto: deuda.monto,
            detalle: deuda.detalle,
            id: Date.now()
        })
    }
    deleteDeuda(deudaEliminar) {
        this.deudas.map((deuda) => {
            if (deuda.id === deudaEliminar.id) {
                this.deudas.splice(this.deudas.findIndex(deuda => deuda.id === deudaEliminar.id), 1)
            }
        })
    }
}
export default { Persona };