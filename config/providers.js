let providers = {};

exports.registerProvider = function registerProvider(name, entry) {
  if (providers[name]) {
    throw new Error(`state provider "${name}" is already registered`);
  }

  providers[name] = entry;
};

exports.getProviders = function getProviders() {
  return providers;
};

// eslint-disable-next-line no-underscore-dangle
exports.__reset = () => {
  providers = {};
};
