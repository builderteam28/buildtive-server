class ChatController {
  static fetchAllUserChat(req, res, next) {
    const UserId = req.user.id;
    console.log("tes")
    // Chat.findAll({
    //   where: { UserId },
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['email', 'fullName'],
    //     },
    //     {
    //       model: Worker,
    //       attributes: ['email', 'fullName'],
    //     },
    //     {
    //       model: Message,
    //       attributes: ['author', 'ChatId', 'CreatedAt'],
    //     },
    //   ],
    // })
    //   .then((data) => {
    //     res.status(200).json(data);
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     next(error);
    //   });



  }
}

module.exports = ChatController;