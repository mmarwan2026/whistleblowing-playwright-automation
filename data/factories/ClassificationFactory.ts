import {
  ClassificationData
} from '../../models/public/ClassificationData';


export class ClassificationFactory {

  static default():
    ClassificationData {

    return {
      internalAuditAnswer: 'No',

      category:
        'Nepotism/Cronyism'
    };
  }
}