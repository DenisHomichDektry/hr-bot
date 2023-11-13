import { Actions } from 'src/constants/actions';

export const feedbackRange = [
  'null', // to avoid 0 index
  Actions.OneStar,
  Actions.TwoStars,
  Actions.ThreeStars,
  Actions.FourStars,
  Actions.FiveStars,
];
