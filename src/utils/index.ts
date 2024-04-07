const models = require("../models");

const deleteRegistration = async (student_email: string) => {
    return await models.Registration.destroy({
      where: { email: student_email },
    });
  };



  export {
    deleteRegistration
}