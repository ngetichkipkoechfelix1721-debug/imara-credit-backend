let applications = [];

function addApplication(application) {
  applications.unshift(application);
  return application;
}

function getApplications() {
  return applications;
}

function findApplication(id) {
  return applications.find(app => app.id === id);
}

function updateApplication(id, changes) {
  const application = findApplication(id);

  if (!application) {
    return null;
  }

  Object.assign(application, changes);

  return application;
}

module.exports = {
  addApplication,
  getApplications,
  findApplication,
  updateApplication
};
