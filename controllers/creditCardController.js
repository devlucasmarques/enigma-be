const UserCreditCard = require('../models/creditCardModel');
const UserModel = require('../models/userModel');
const mercadopago = require('mercadopago');

const generateMaskedCardNumber = (cardNumber) => {
  return cardNumber.replace(/\d(?=\d{4})/g, '*');
};

const creditCardController = {
  save: async (req, res) => {
    try {
      if (req.level > 10)
        return res.status(403).json({ factories: [], models: [], modules: [] });

      const { userId } = req;
      const { cardNumber, cardholderName, expirationDate } = req.body;

      const paymentProcessorToken = 'ABCDEF'; //plataforma de pagamentos

      const newCreditCard = new UserCreditCard({
        userId,
        creditCard: {
          maskedCardNumber: generateMaskedCardNumber(cardNumber),
          cardholderName,
          expirationDate,
          paymentProcessorToken
        }
      });

      await newCreditCard.save();

      res
        .status(201)
        .json({ message: 'Credit card details saved successfully.' });
    } catch (error) {
      console.error('Error saving credit card details:', error);
      res.status(500).json({ message: 'Failed to save credit card details.' });
    }
  },
  list: async (req, res) => {
    try {
      if (req.level > 10)
        return res.status(403).json({ factories: [], models: [], modules: [] });

      const cardsFound = await UserCreditCard.find(
        { userId: req.userId, creditCard: { $exists: true } },
        'creditCard.cardholderName creditCard.expirationDate creditCard.maskedCardNumber'
      );

      const mapCardsFound = cardsFound.map((card) => ({
        id: card.id,
        cardholderName: card.creditCard.cardholderName,
        expirationDate: card.creditCard.expirationDate,
        maskedCardNumber: card.creditCard.maskedCardNumber
      }));

      res.status(200).json(mapCardsFound);
    } catch (error) {
      console.error('Error listing credit cards:', error);
      res.status(500).json({ message: 'Failed to list credit cards.' });
    }
  },
  erase: async (req, res) => {
    try {
      if (req.level > 10)
        return res.status(403).json({ factories: [], models: [], modules: [] });

      const cardDeleted = await UserCreditCard.deleteOne({
        userId: req.userId,
        _id: req.params.creditCardId
      });

      if (!cardDeleted) {
        return res.status(500).json({ error: true });
      }

      cardDeleted.deletedCount
        ? res.status(200).json({ message: 'Success deleted' })
        : res.status(404).json({ error: true });
    } catch (error) {
      console.error('Error delete credit card:', error);
      res.status(500).json({ message: 'Failed to delete credit card.' });
    }
  },
  selected: async (req, res) => {
    try {
      if (req.level > 10)
        return res.status(403).json({ factories: [], models: [], modules: [] });

      const { userId } = req;

      //precisa criar um preferences pra salvar o codigo do cartao
      const userCreditCard = UserCreditCard.findOneAndUpdate(
        { userId },
        { $set: { creditCardSelected: req.params.creditCardId } }
      );
      if (!userCreditCard) {
        return res.status(404).json({ error: true });
      }

      res.status(200).json({ message: 'Credit card selected.' });
    } catch (error) {
      console.error('Error saving credit card details:', error);
      res.status(500).json({ message: 'Failed to save credit card details.' });
    }
  },
  payment: async (req, res) => {
    const mpPublicKey = process.env.MERCADO_PAGO_SAMPLE_PUBLIC_KEY;

    console.log(mpPublicKey);
    if (!mpPublicKey) {
      console.log('Error: public key not defined');
      process.exit(1);
    }
    const mpAccessToken = process.env.MERCADO_PAGO_SAMPLE_ACCESS_TOKEN;
    if (!mpAccessToken) {
      console.log('Error: access token not defined');
      process.exit(1);
    }

    try {
      const client = new mercadopago.MercadoPagoConfig({
        accessToken: mpAccessToken
      });

      const payment = new mercadopago.Payment(client);
      const {
        transaction_amount,
        token,
        description,
        installments,
        payment_method_id,
        payer
      } = req.body;

      const body = {
        transaction_amount,
        token,
        description,
        installments,
        payment_method_id,
        payer
      };
      console.log(body);

      const res2 = await payment.create({ body });
      console.log(res2);
      console.log(res2.payment_method.data);

      if (res2.status === 'approved') {
        return res.status(200).json({ message: 'successo' });
      }
      return res.status(203).json({ message: res2.status });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao processar transação:' });
      console.error('Erro ao processar transação:', error);
    }
  }
};

module.exports = creditCardController;
