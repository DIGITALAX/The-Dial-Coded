import { UseSliderResults } from "../types/slider.types";

const useSlider = (): UseSliderResults => {
  const scannerSlider: string[] = [
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
  ];

  const highlightsSlider: string[] = [
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
  ];

  const dropsSlider: string[] = [
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
  ];

  const reachSlider: string[] = [
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
  ];

  const recordsSlider: string[] = [
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
    "QmXTE1yHUs6geX3Y1QDaTLk1jLbm9Vyx7y3xAB9ox8j13j",
    "QmWRnieLeHfC3jQkuXZ4z2Z1DHfKsThCaReUGkcp3GGU6b",
    "QmeodnXaSi9jXczczcN4i5a9VEp5fDowVGBJtRHvy1hHRD",
  ];

  return {
    scannerSlider,
    highlightsSlider,
    recordsSlider,
    reachSlider,
    dropsSlider,
  };
};

export default useSlider;
