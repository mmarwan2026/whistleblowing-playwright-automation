import { ClassificationData } from '../../models/public/ClassificationData';

export class ClassificationFactory {
  static default(): ClassificationData {
    return {
      category: 'Other',
      otherText: 'Automation test classification'
    };
  }
}
