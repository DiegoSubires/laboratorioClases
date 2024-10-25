import "./style.css";

export interface Reserva {
  tipoHabitacion: "standard" | "suite";
  pax: number;
  noches: number;
}

export const precioTipoHabitacion = (tipoHabitacion: string): number => {
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
    pax: 1,
    noches: 3,
  },
  {
    tipoHabitacion: "standard",
    pax: 1,
    noches: 4,
  },
  {
    tipoHabitacion: "suite",
    pax: 2,
    noches: 1,
  },
];

class TotalReserva {
  reserva: Reserva[];
  //subtotal: number;
  cargoAdicional: number;
  // total: number;

  constructor(reserva: Reserva[]) {
    this.reserva = reserva;
    // this.subtotal = 0;
    this.cargoAdicional = 40;
    // this.total = 0;
  }
  get subtotal() {
    return (
      Math.round(
        100 *
          this.reserva.reduce(
            (acc, cur) =>
              acc +
              cur.noches *
                (precioTipoHabitacion(cur.tipoHabitacion) +
                  this.cargoAdicional * (cur.pax - 1)),
            0
          )
      ) / 100
    );
  }
  get total() {
    return Math.round(100 * (1.21 * this.subtotal)) / 100;
  }

  /* calculaSubtotal() {
    this.subtotal =
      Math.round(
        100 *
          this.reserva.reduce(
            (acc, cur) =>
              acc +
              cur.noches *
                (precioTipoHabitacion(cur.tipoHabitacion) +
                  this.cargoAdicional * (cur.pax - 1)),
            0
          )
      ) / 100;
  }
  calculaTotal() {
    this.total = Math.round(100 * (1.21 * this.subtotal)) / 100;
  }*/
}

const clienteParticular = new TotalReserva(reservas);

console.log(clienteParticular.subtotal, clienteParticular.total);

class TotalReservaTourOperador extends TotalReserva {
  descuento: number;

  constructor(descuento: number, reserva: Reserva[]) {
    super(reserva);
    this.descuento = descuento;
  }

  get subtotal() {
    return (
      Math.round(
        100 *
          this.reserva.reduce(
            (acc, cur) =>
              acc + cur.noches * (100 + this.cargoAdicional * (cur.pax - 1)),
            0
          )
      ) / 100
    );
  }

  get totalConDescuento() {
    return Math.round(100 * (1 - this.descuento / 100) * this.total) / 100;
  }
}

const tourOperador = new TotalReservaTourOperador(15, reservas);

console.log(
  tourOperador.subtotal,
  tourOperador.total,
  tourOperador.totalConDescuento
);
