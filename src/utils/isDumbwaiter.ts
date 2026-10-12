export const isDumbwaiter = (elevator: { [key: string]: unknown }) =>
  String(elevator.description ?? '').trim().toLowerCase() === 'dumbwaiter lift';
