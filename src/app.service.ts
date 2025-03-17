import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  async checkDbConnection(): Promise<string> {
    try {
      await this.dataSource.query('SELECT 1');
      return '✅ Подключение к БД успешно!';
    } catch (error) {
      return `❌ Ошибка подключения: ${error?.message}`;
    }
  }
}
