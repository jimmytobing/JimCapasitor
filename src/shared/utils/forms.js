export function createFormChangeHandler(setState) {
  return function handleChange(event) {
    const { name, value } = event.target

    setState((current) => ({
      ...current,
      [name]: value,
    }))
  }
}
