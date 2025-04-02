import odbc from 'odbc';
import { OdbcConnection } from './siapsep.interface';

export class SiapsepConnection implements OdbcConnection {
  private connection: odbc.Connection | undefined;

  private async connect() {
    if (this.connection) {
      return;
    }
    this.connection = await odbc.connect('DSN=nomina3');
  }

  async execute<T>(query: string, args: (string | number)[]) {
    await this.connect();

    try {
      const statement = await this.connection!.createStatement();
      await statement.prepare(query);
      // if (args) {
      await statement.bind([...args]);
      // }
      const result = await statement.execute<T>();
      // await Promise.all([statement.close(), this.connection!.close()]);
      statement.close();

      return result;
    } catch (error) {
      throw Error('Error en la conexión del SIAPSEP, favor de verificar el servidor');
    }
  }
}
