export default () => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
      sizeLimit: 100 * 1024 * 1024, // 100MB
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64,
      },
      responsiveDimensions: true,
    },
  },
});
