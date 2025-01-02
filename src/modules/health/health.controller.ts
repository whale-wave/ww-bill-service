import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, HttpHealthIndicator, MemoryHealthIndicator } from '@nestjs/terminus';
import { isWindows } from '../../utils';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService, private readonly http: HttpHealthIndicator, private readonly disk: DiskHealthIndicator, private readonly memory: MemoryHealthIndicator) {}

  @Get()
  @HealthCheck()
  check() {
    const path = isWindows() ? 'D:\\' : '/';
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () => this.disk.checkStorage('storage', { path, thresholdPercent: 0.8 }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
