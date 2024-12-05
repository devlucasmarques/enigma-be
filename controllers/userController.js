const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const PaymentModel = require('../models/paymentModel');
const PlanModel = require('../models/planModel');

const transporter = require('../config/email');

require('dotenv-safe').config();
const jwt = require('jsonwebtoken');
const { hashCode } = require('../helpers/hash');
const { baseURL } = require('../contants');
const {
  differenceInMonths,
  addMonths,
  isBefore,
  isEqual,
  startOfDay
} = require('date-fns');

const getUsers = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const users = await UserModel.find(
    {
      level: { $gte: 5 }
    },
    {
      _id: 1,
      cpf: 1,
      credits: 1,
      deactive: 1,
      email: 1,
      fone: 1,
      level: 1,
      name: 1,
      user: 1,
      lastPaymentDate: 1,
      planMonthNumber: 1,
      hash: 1
    }
  );

  res.status(200).json(users);
};

const saveUser = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const { body } = req;
  const { name, cpf, fone, email, credits, planMonthNumber, lastPaymentDate } =
    body;

  if (email) {
    const found = await UserModel.findOne({ email });

    if (found) {
      res.status(400).json({ error: true });
      return;
    }
  }
  const level = 10;
  const deactive = true;

  const doc = new UserModel({
    name,
    cpf,
    fone,
    email,
    level,
    credits,
    deactive,
    planMonthNumber,
    lastPaymentDate
  });
  const saved = await doc.save();
  saved ? res.status(201).json(saved._id) : res.status(500).json({});
};

const editUser = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const { body, params } = req;
  console.log(body);
  const { name, cpf, fone, credits, level, planMonthNumber } = body;
  const { id: _id } = params;

  if (!cpf)
    return res.status(400).json({ error: true, message: 'CPF inválido' });
  if (!name)
    return res.status(400).json({ error: true, message: 'Nome inválido' });
  if (!fone)
    return res.status(400).json({ error: true, message: 'Telefone inválido' });
  if (!planMonthNumber)
    return res.status(400).json({ error: true, message: 'Plano inválido' });

  const found = await UserModel.findOne({ _id });

  if (!found) {
    res.status(400).json({ error: true });
    return;
  }

  if (!mongoose.isValidObjectId(_id)) {
    res.status(400).json({ error: true });
    return;
  }

  const changed = await UserModel.updateOne(
    { _id },
    { name, cpf, fone, credits, level, planMonthNumber }
  );
  if (!changed) {
    res.status(500).json({ error: true });
    return;
  }

  changed
    ? res.status(200).json({ error: false })
    : res.status(404).json({ error: true });
};

const editNewUser = async (req, res) => {
  const { body, params } = req;
  const { name, cpf, fone, password, email } = body;
  const { id: _id } = params;

  if (!email)
    return res.status(400).json({ error: true, message: 'E-mail inválido' });
  if (!cpf)
    return res.status(400).json({ error: true, message: 'CPF inválido' });
  if (!name)
    return res.status(400).json({ error: true, message: 'Nome inválido' });
  if (!password)
    return res.status(400).json({ error: true, message: 'Senha inválida' });
  if (!fone)
    return res.status(400).json({ error: true, message: 'Telefone inválido' });

  try {
    const found = await UserModel.findOne({ email });
    if (found) {
      return res
        .status(400)
        .json({ error: true, message: 'E-mail já está cadastrado' });
    }

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ error: true });
    }

    const foundId = await UserModel.findOne({ _id });
    if (!foundId) {
      return res.status(400).json({ error: true });
    }

    if (!foundId.deactive) {
      return res
        .status(400)
        .json({ error: true, message: 'E-mail ativado!!!' });
    }

    const credits = 0;
    const level = 10;
    deactive = true;

    const changed = await UserModel.updateOne(
      { _id },
      { name, cpf, fone, password, email, credits, level, deactive }
    );
    if (!changed) {
      return res.status(500).json({ error: true });
    }

    changed
      ? res.status(200).json({ error: false })
      : res.status(404).json({ error: true });
  } catch (err) {
    return res.status(500).json({ error: true });
  }
};

const payment = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const { id: _id } = req.params;

  if (!mongoose.isValidObjectId(_id)) {
    res.status(400).json({ error: true });
    return;
  }

  const { lastPaymentDate, planMonthNumber, deactive, name } =
    await UserModel.findOne(
      { _id },
      { lastPaymentDate: 1, planMonthNumber: 1, name: 1, deactive: 1 }
    );

  if (deactive) {
    return res.status(400).json({ message: 'O cliente está desativado!' });
  }

  if (!planMonthNumber) {
    return res
      .status(400)
      .json({ message: 'Escolha um plano para o cliente!' });
  }

  const dateNow = new Date();
  if (lastPaymentDate) {
    const monthDiff = differenceInMonths(dateNow, lastPaymentDate);

    if (monthDiff === 0) {
      return res.status(400).json({ message: 'O pagamento já foi realizado!' });
    }
    const { dueDate } = await PaymentModel.findOne(
      { idUser: _id },
      { dueDate: 1 }
    );
    if (!dueDate)
      return res.status(400).json({
        message: 'Erro não esperado. Date de vencimento não encontrada!'
      });

    const startDueDate = startOfDay(dueDate);
    const startDateNow = startOfDay(dateNow);
    const isPaymentDay =
      isBefore(startDueDate, startDateNow) ||
      isEqual(startDueDate, startDateNow);

    if (!isPaymentDay)
      return res.status(400).json({ message: 'Não está no mês do pagamento!' });
  }

  let cost = 0;
  const [plans] = await PlanModel.find();

  if (!plans) {
    return res.status(500).json({ error: true });
  }
  switch (planMonthNumber) {
    case 1:
      cost = plans.valueMonth1;
      break;
    case 2:
      cost = plans.valueMonth2;
      break;
    case 3:
      cost = plans.valueMonth3;
      break;
    case 4:
      cost = plans.valueMonth4;
      break;
    case 5:
      cost = plans.valueMonth5;
      break;
    case 6:
      cost = plans.valueMonth6;
      break;
    case 7:
      cost = plans.valueMonth7;
      break;
    case 8:
      cost = plans.valueMonth8;
      break;
    case 9:
      cost = plans.valueMonth9;
      break;
    case 10:
      cost = plans.valueMonth10;
      break;
    case 11:
      cost = plans.valueMonth11;
      break;
    case 12:
      cost = plans.valueMonth12;
      break;
  }

  const doc = new PaymentModel({
    paymentDate: dateNow,
    dueDate: addMonths(dateNow, planMonthNumber),
    cost,
    userName: name,
    idUser: _id,
    adminName: req.name
  });
  const saved = await doc.save();
  if (!saved) {
    res.status(500).json({});
  }

  const changed = await UserModel.updateOne(
    { _id },
    { lastPaymentDate: new Date() }
  );
  if (!changed) {
    return res.status(500).json({ error: true });
  }
  return res.status(201).json({ message: 'Pagamento aprovado!' });
};

const deactiveUser = async (req, res) => {
  if (req.level > 5)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const { id: _id } = req.params;
  const { deactive } = req.query;

  if (!mongoose.isValidObjectId(_id)) {
    res.status(400).json({ error: true });
    return;
  }

  const changed = await UserModel.updateOne({ _id }, { deactive });
  if (!changed) {
    res.status(500).json({ error: true });
    return;
  }

  changed
    ? res.status(200).json({ error: false })
    : res.status(404).json({ error: true });
};

const deleteUser = async (req, res) => {
  if (req.level > 1)
    return res.status(403).json({ factories: [], models: [], modules: [] });

  const { params } = req;
  const { id: _id } = params;

  if (!mongoose.isValidObjectId(_id)) {
    res.status(400).json({ error: true });
    return;
  }

  const deleted = await UserModel.deleteOne({ _id });
  if (!deleted) {
    res.status(500).json({ error: true });
    return;
  }

  deleted && deleted.deletedCount
    ? res.status(200).json({ error: false })
    : res.status(404).json({ error: true });
};

const logged = (req, res) => {
  const loggedWithLevel = req.level ? req.level : 100;
  const { name } = req;

  res.status(200).json({ loggedWithLevel, name });
};

const login = async (req, res) => {
  const { body } = req;
  const { email, password, hash = '' } = body;

  if (!email) {
    return res.status(404).json({ error: true });
  }

  const found = await UserModel.findOne({
    email
  });

  if (found && found.lastPaymentDate) {
    const dateNow = new Date();
    const monthDiff = differenceInMonths(dateNow, found.lastPaymentDate);
    if (monthDiff > found.planMonthNumber) {
      return res
        .status(200)
        .json({ status: 402, message: 'Aguardando pagamento' });
    }
  } else {
    if (found && found.level > 1) {
      return res
        .status(200)
        .json({ status: 402, message: 'Aguardando pagamento' });
    }
  }

  if (hash) {
    const found = await UserModel.findOne({
      email,
      hash,
      deactive: { $ne: true }
    });

    if (found) {
      await UserModel.updateOne(
        {
          email,
          deactive: { $ne: true }
        },
        { changePassword: '', hash: '', password: found.changePassword }
      );
    }
  }

  if (!email || !password) {
    res.status(404).json({ error: true });
    return;
  }

  try {
    const found = await UserModel.findOne({
      email,
      password,
      deactive: { $ne: true }
    });

    const TWO_HOURS = 2 * 60 * 60;
    if (found) {
      const { _id: id, name } = found;
      const level = found['level'] || 10;
      const token = jwt.sign({ id, level, name, email }, process.env.SECRET, {
        expiresIn: TWO_HOURS
      });

      const dateNow = new Date();
      const monthDiff = differenceInMonths(dateNow, found.lastPaymentDate);

      const monthPayment = monthDiff === found.planMonthNumber;

      res.json({ auth: true, token, level, monthPayment });
    } else res.status(404).json({ error: true });
  } catch (err) {
    res.status(500).json({ error: true });
  }
};

const getUser = async (req, res) => {
  const { params } = req;
  const { id } = params;

  const found = await UserModel.findOne({
    _id: id
  });

  if (found) {
    const {
      cpf,
      credits,
      deactive,
      email,
      fone,
      lastPaymentDate,
      level,
      name,
      planMonthNumber,
      _id
    } = found;
    const userDTO = {
      cpf,
      credits,
      deactive,
      email,
      fone,
      lastPaymentDate,
      level,
      name,
      planMonthNumber,
      _id
    };
    res.json(userDTO);
  } else res.status(404).json({ error: true });
};

const changePassword = async (req, res) => {
  const { body } = req;
  const { email, password, cpf, fone, isNewUser } = body;

  if (!email || !password) {
    res.status(404).json({ error: true });
    return;
  }

  const hash = hashCode(password);

  try {
    let found = { n: 0 };
    let saved = false;
    const label = isNewUser
      ? 'Confirmação para novo usuário da calculadora'
      : 'Confirmação para alterar a senha da calculadora';

    const route = isNewUser ? 'pagar' : 'login';
    if (isNewUser) {
      const doc = new UserModel({
        name: email,
        changePassword: password,
        hash,
        cpf,
        fone,
        email,
        level: 10,
        credits: 5,
        deactive: false
      });
      console.log(doc);
      const foundNew = await UserModel.findOne({ email, cpf });
      // const foundNew = false;
      if (foundNew) {
        return res.status(400).json({ error: true });
      }
      saved = await doc.save();
      //res.status(201).json({ message: 'sucesso' });
    } else {
      found = await UserModel.updateOne(
        {
          email,
          deactive: { $ne: true }
        },
        { changePassword: password, hash }
      );
    }

    if (found.n === 1 || saved) {
      const mailOptions = {
        from: 'suporte@cm-treinamentos.com.br',
        to: email,
        subject: label,
        html: `
            <h2 style="color: black">${label}</h2>
            <div style="color: black">Se você não pediu, desconsidere esse email e comunique os responsáveis</div>
            <div style="color: black">Ao confirmar, sua nova senha será <b style="color: red">${password}</b> </div>
            <div><a href='${baseURL}/${route}?email=${email}&confirm=${hash}'>Clique aqui</a> para confirmar</div>
            <br />
            <p style="color: red">Não responda esse email, pois o recebimento está desabilitado</p>
            <div style="color: black">Atenciosamente, </div>
            <div style="color: black"><b>Equipe cm-treinamentos</b> </div>
          `
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res
            .status(503)
            .json({ error: false, message: 'Erro ao enviar o email' });
        } else {
          if (saved) {
            return res.status(201).json(saved._id);
          }
          res
            .status(200)
            .json({ error: false, message: `Email enviado! ${info.response}` });
        }
      });
    } else res.status(404).json({ error: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true });
  }
};

module.exports = {
  getUsers,
  getUser,
  saveUser,
  editNewUser,
  editUser,
  deleteUser,
  deactiveUser,
  login,
  logged,
  changePassword,
  payment
};
