import {
  ClassificationData
} from '../../models/public/ClassificationData';

export class ClassificationFactory {

  static default(): ClassificationData {

    return {
      internalAuditAnswer: 'No',

      category:
        'Conflict of Interest',

      subCategory:
        'Nepotism/Cronyism'
    };
  }
}