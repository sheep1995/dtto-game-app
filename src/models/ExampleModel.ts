export interface Example {
    id: number;
    name: string;
  }
  
  export class ExampleModel {
    private examples: Example[] = [];
  
    constructor() {
      this.examples.push({ id: 1, name: 'Example 1' });
      this.examples.push({ id: 2, name: 'Example 2' });
    }
  
    getAllExamples(): Example[] {
      return this.examples;
    }
  }
  