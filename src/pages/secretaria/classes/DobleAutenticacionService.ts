export class DobleAutenticacionService {
  private readonly duracionSegundos =
    5 * 60;

  crearExpiracion(): number {
    return (
      Date.now() +
      this.duracionSegundos *
        1000
    );
  }

  estaExpirada(
    expiresAt: number
  ): boolean {
    return (
      Date.now() >= expiresAt
    );
  }

  validarCodigo(
    codigo: string
  ): boolean {
    return /^\d{6}$/.test(
      codigo.trim()
    );
  }

  obtenerDuracionSegundos():
    number {
    return this.duracionSegundos;
  }
}