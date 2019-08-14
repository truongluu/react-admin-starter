import mockjs from 'mockjs';

const { Random } = mockjs;

export default {
  'GET /api/profile/basic': (req, res) => {
    const { id } = req.query;
    const application = {
      id,
      status: '已取货',
      orderNo: Random.id(),
      childOrderNo: Random.id(),
    };
    const userInfo = {
      name: Random.cname(),
      tel: '18100000000',
      delivery: '菜鸟物流',
      addr: '浙江省杭州市西湖区万塘路18号',
      remark: '备注',
    };
    res.json({
      userInfo,
      application,
    });
  },
};
