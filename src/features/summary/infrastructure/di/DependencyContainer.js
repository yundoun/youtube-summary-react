import { SummaryUseCases } from '../../domain/useCases/summaryUseCases';
import { WebSocketUseCases } from '../../domain/useCases/webSocketUseCases';
import { SummaryRepositoryImpl } from '../repositories/SummaryRepositoryImpl';
import { WebSocketServiceImpl } from '../repositories/WebSocketServiceImpl';
import { StateService } from '../../application/services/StateService';

class DependencyContainer {
  constructor() {
    // Services
    this.stateService = new StateService();

    // Repositories
    this.summaryRepository = new SummaryRepositoryImpl(this.httpService);
    this.webSocketRepository = new WebSocketServiceImpl(this.stateService);

    // UseCases
    this.summaryUseCases = new SummaryUseCases(this.summaryRepository);
    this.webSocketUseCases = new WebSocketUseCases(this.webSocketRepository);
  }

  getSummaryUseCases() {
    return this.summaryUseCases;
  }

  getWebSocketUseCases() {
    return this.webSocketUseCases;
  }

  getStateService() {
    return this.stateService;
  }
}

export const dependencyContainer = new DependencyContainer();