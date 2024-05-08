import { Request, Response } from 'express';
import { ExampleModel } from '../models/ExampleModel';

export class ExampleController {
  private exampleModel: ExampleModel = new ExampleModel();

  public getAllExamples(req: Request, res: Response): void {
    const examples = this.exampleModel.getAllExamples();
    res.json(examples);
  }
}
