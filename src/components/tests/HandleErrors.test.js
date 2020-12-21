
function handleErrors(res) {
  if (!res.ok) {
      throw Error(res)
  }
  return res
}

describe('handleErrors function', () => {

  test('handleErrors goes as expected', () => {
    expect(() => handleErrors()).toThrow();
    expect(() => handleErrors()).toThrow(Error);
  })
})
