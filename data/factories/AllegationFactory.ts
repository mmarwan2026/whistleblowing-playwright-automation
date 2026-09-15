import { AllegationData } from '../../models/public/AllegationData';

export class AllegationFactory {

  static default(): AllegationData {

    return {
      incidentTitle:
        'Potential conflict of interest',

      whatHappened:
        'An employee may have participated in a decision involving a related party.',

      rulePolicyLaw:
        'Conflict of Interest Policy',

      awarenessMethod:
        'I became aware through internal business communication.',

      incidentLocation:
        'Corporate Office',

      knowsExactDate:
        'No',

      incidentDateDescription:
        'September 2026',

      ongoing:
        'No'
    };
  }
}