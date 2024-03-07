import { store } from './store';
import { Provider } from "react-redux";
import { Grommet } from 'grommet';

const theme = {
  global: {
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Grommet theme={theme} full>
            <Provider store={store}>
                {children}
            </Provider>
        </Grommet>
    );
}