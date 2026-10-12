export function optionalItemOwner(
  item: { elevatorId?: number },
  elevators: readonly { id: number }[],
) {
  return elevators.find((elevator) => elevator.id === item.elevatorId)?.id ?? elevators[0]?.id;
}
