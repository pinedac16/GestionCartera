



export class Usuarios {
    Id: number;
    Nombres: string;
    Apellidos: string;
    Nacionalidad: string;
    Codigo: string;
    Correo: string;
    CorreoExterno: string;
    Telefono: string;
    IdTipoUsuario: number;
    TipoUsuario: string;
    IdTipoCodigo: number;
    TipoCodigo: string;
    Cargo: string;
    Empresa: string;
    CategoriaId: number;
    Categoria: string;
    Impreso: Boolean;
}

export class Cliente {
    Id: number;
    NIT: string;
    Nombre: string;
    Direccion: string;
    Telefono: string;
    Municipio: string;
}

export class Cita {
    id: number;
    objetivo: string;
    fecha: string;
    resultado: string;
    idFactura: string;
}

export class Factura {
    Id: number;
    Numero: String;
    Fecha: String;
    Descripcion: string;
    Valor: string;
    Cliente: string;
    Estado: string;
}




export class TiposUsuario {
    Id: string;
    Titulo: string;
}
