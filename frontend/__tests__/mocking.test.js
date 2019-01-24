// this function would leave in an outside library

function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    // Simulate an API, we will want to mock it to not wait for the response
    setTimeout(() => resolve(this.foods), 2000);
  });
};

describe("mocking learning", () => {
  it("mocks a reg function", () => {
    const fetchDogs = jest.fn();
    fetchDogs("snickers"); // mocked
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith("snickers");
    fetchDogs("hugo "); // mocked
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it("can create a person", () => {
    const me = new Person("Carlos", ["pizza", "hamburguesa"]);
    expect(me.name).toBe("Carlos");
  });

  it("can fetch foods", async () => {
    const me = new Person("Carlos", ["pizza", "hamburguesa"]);
    // mock the favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(["sushi", "ramen"]);
    const favFoods = await me.fetchFavFoods();
    expect(favFoods).toContain("sushi");
  });
});
