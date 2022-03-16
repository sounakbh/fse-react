import {Tuits} from "../components/tuits";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllTuits} from "../services/tuits-service";
import axios from "axios";
import TuitsData from "../components/tuits/tuits-data.json";
import TuitsList from "../components/tuits/index";


const MOCKED_USERS = [
  "alice", "bob", "charlie"
];

const MOCKED_TUITS = [
  "alice's tuit", "bob's tuit", "charlie's tuit"
];

test('tuit list renders static tuit array', () => {
  render(
      <HashRouter>
        <TuitsList tuits={TuitsData}/>
      </HashRouter>);
  const linkElement = screen.getByText(/@SpaceX Dragon spacecraft/i);
  expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
    const tuits = await findAllTuits();
    render(
        <HashRouter>
            <TuitsList tuits={tuits}/>
        </HashRouter>);
    const linkElement = screen.getByText(/sounak's first tuit/i);
    expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
    const mock = jest.spyOn(axios, 'get');
    mock.mockImplementation(() =>
        Promise.resolve({ data: {tuits: TuitsData} }));
    const response = await findAllTuits();
    const tuits = response.tuits;
    render(
        <HashRouter>
            <TuitsList tuits={tuits}/>
        </HashRouter>);

    const user = screen.getByText(/@SpaceX Dragon spacecraft/i);
    expect(user).toBeInTheDocument();
    mock.mockRestore();
});
