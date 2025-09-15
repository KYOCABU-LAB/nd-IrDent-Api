export class UserValidator {
  /**
   * Valida el formato del email
   * @param email Email a validar
   * @returns true si el email es válido, false en caso contrario
   */
  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 0;
  }

  /**
   * Valida el formato del nombre de usuario
   * @param username Nombre de usuario a validar
   * @returns true si el nombre de usuario es válido, false en caso contrario
   */
  static validateUsername(username: string): boolean {
    if (!username || typeof username !== 'string') {
      return false;
    }
    // Permite letras, números, guiones y guiones bajos, mínimo 4 caracteres
    const usernameRegex = /^[a-zA-Z0-9_-]{4,}$/;
    return usernameRegex.test(username);
  }

  /**
   * Valida la fortaleza de la contraseña
   * @param password Contraseña a validar
   * @returns true si la contraseña es válida, false en caso contrario
   */
  static validatePassword(password: string): boolean {
    if (!password || typeof password !== 'string') {
      return false;
    }
    // Requiere al menos 6 caracteres, una mayúscula, una minúscula y un número o carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|\W).{6,}$/;
    return passwordRegex.test(password);
  }
}