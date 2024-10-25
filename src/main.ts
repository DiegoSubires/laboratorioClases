import "./style.css";

// INTERFACES
interface Reserva {
  tipoHabitacion: "standard" | "suite";
  pax: number;
  desayuno: boolean;
  noches: number;
}
interface PrecioHabitacion {
  standard: number;
  suite: number;
}
interface TipoCliente {
  descuentoCliente: number;
  tipoPrecioHabitacion: PrecioHabitacion;
}

// Definición de las condiciones pago para cada tipo de cliente.

const clienteParticular: TipoCliente = {
  descuentoCliente: 0,
  tipoPrecioHabitacion: {
    standard: 100,
    suite: 150,
  },
};

const clienteTouroperador: TipoCliente = {
  descuentoCliente: 15,
  tipoPrecioHabitacion: {
    standard: 100,
    suite: 100,
  },
};

// Precio por habitación (únicamente para la clase padre)
export const precioHabitacion = (tipoHabitacion: string): number => {
  let precio: number = 0;
  switch (true) {
    case tipoHabitacion === "standard":
      precio = 100;
      break;
    case tipoHabitacion === "suite":
      precio = 150;
      break;
  }
  return precio;
};

export const reservas: Reserva[] = [
  {
    tipoHabitacion: "standard",
    desayuno: false,
    pax: 1,
    noches: 3,
  },
  {
    tipoHabitacion: "standard",
    desayuno: false,
    pax: 1,
    noches: 4,
  },
  {
    tipoHabitacion: "suite",
    desayuno: true,
    pax: 2,
    noches: 1,
  },
];

// Clase padre

class TotalReserva {
  reserva: Reserva[];
  cargoAdicionalPersona: number;

  constructor(reserva: Reserva[]) {
    this.reserva = reserva;
    this.cargoAdicionalPersona = 40;
  }
  get subtotal() {
    return (
      Math.round(
        100 *
          this.reserva.reduce(
            (acc, cur) =>
              acc +
              cur.noches *
                (precioHabitacion(cur.tipoHabitacion) +
                  this.cargoAdicionalPersona * (cur.pax - 1)),
            0
          )
      ) / 100
    );
  }

  get total() {
    return Math.round(100 * (1.21 * this.subtotal)) / 100;
  }
}

// Nueva clase hija

class TotalReservaTipoCliente extends TotalReserva {
  tipoCliente: TipoCliente;

  constructor(tipoCliente: TipoCliente, reserva: Reserva[]) {
    super(reserva);
    this.tipoCliente = tipoCliente;
  }
  precioTipoHabitacion(tipoHabitacion: "standard" | "suite") {
    if (tipoHabitacion === "standard") {
      return this.tipoCliente.tipoPrecioHabitacion.standard;
    } else if (tipoHabitacion === "suite") {
      return this.tipoCliente.tipoPrecioHabitacion.suite;
    } else {
      return 0;
    }
  }

  get subtotal() {
    return (
      Math.round(
        100 *
          this.reserva.reduce((acc, cur) => {
            let cargoHabitacionNoche = this.precioTipoHabitacion(
              cur.tipoHabitacion
            );
            let cargoPersonasAdicionalesNoche =
              this.cargoAdicionalPersona * (cur.pax - 1);

            let cargoDesayunoNoche = 0;
            if (cur.desayuno) {
              cargoDesayunoNoche = 15 * cur.pax;
            }

            return (
              acc +
              cur.noches *
                (cargoHabitacionNoche +
                  cargoPersonasAdicionalesNoche +
                  cargoDesayunoNoche)
            );
          }, 0)
      ) / 100
    );
  }

  get totalConDescuento() {
    return (
      Math.round(
        100 * (1 - this.tipoCliente.descuentoCliente / 100) * this.total
      ) / 100
    );
  }
}

// Instancias de clase

const totalReservaclienteParticular = new TotalReservaTipoCliente(
  clienteParticular,
  reservas
);
const totalReservaclienteTouroperador = new TotalReservaTipoCliente(
  clienteTouroperador,
  reservas
);

// Resultados

console.log(
  totalReservaclienteParticular.subtotal,
  totalReservaclienteParticular.total,
  totalReservaclienteParticular.totalConDescuento
);
console.log(
  totalReservaclienteTouroperador.subtotal,
  totalReservaclienteTouroperador.total,
  totalReservaclienteTouroperador.totalConDescuento
);
