import odbc from 'odbc';
import { ExecuteProps, OdbcConnection } from './siapsep.interface';

export class SiapsepConnection implements OdbcConnection {
  private connection: odbc.Connection | undefined;

  private async connect() {
    if (this.connection) {
      return;
    }
    this.connection = await odbc.connect('DSN=nomina3');
  }

  async prepareStatement<T>({ query, args }: ExecuteProps) {
    await this.connect();

    try {
      const statement = await this.connection!.createStatement();
      await statement.prepare(query);
      if (args) {
        await statement.bind([...args]);
      }
      const result = await statement.execute<T>();
      statement.close();

      return result;
    } catch (error) {
      console.log({ siapsepDb: error });
      throw Error('Error en la conexión del SIAPSEP, favor de verificar el servidor');
    }
  }

  async execute<T>(props: ExecuteProps) {
    return await this.prepareStatement<T>(props);
  }

  async executeSingle<T>(props: ExecuteProps) {
    const data = await this.prepareStatement<T>(props);
    return data[0];
  }
}
