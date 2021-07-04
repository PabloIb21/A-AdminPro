import { Usuario } from "src/models/usuario.model";

export interface CargarUsuario {
    total: number;
    usuarios: Usuario[];
}