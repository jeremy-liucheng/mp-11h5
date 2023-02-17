import request from '@/service/http';
import useStore from '@/store';
import { ApiReturn } from '@/types/utils';
import { Commercial } from '@/types/api/types';
import { downloadXlsxFile } from '@/utils/utils';
import { CRUDapiReturn } from '@/types/axios';
interface CommercialApi {
  getRegisterList: (params: any) => ApiReturn<Commercial.RegisterList>;
  getRegisterInfo: (params: any) => ApiReturn<Commercial.RegisterInfo>;
  auditRegister: (params: any) => ApiReturn<CRUDapiReturn>;
  downLoadApi: (params?: any) => any;
  getSum: (params?: any) => ApiReturn<{ settleMoney: number }>;
  getMpMarchants: () => ApiReturn<Commercial.MpMarchants[]>;
}

const commercialApi: CommercialApi = {
  getRegisterList(params: any) {
    return request.get('/platform', {
      cmd: 'getRegisterList',
      ...params
    });
  },
  getRegisterInfo(params: any) {
    return request.get('/platform', {
      cmd: 'getRegisterInfo',
      ...params
    });
  },
  auditRegister(params: any) {
    return request.get('/platform', {
      cmd: 'auditRegister',
      ...params
    });
  },
  getSum(params: any) {
    return request.get('/bill', {
      cmd: 'getSum',
      ...params
    });
  },
  downLoadApi() {
    const {
      searchModel: { time, month: monthAlias, gameid },
      user: { session }
    } = useStore();
    const [year, month] = monthAlias?.split('/') || [];
    const baseUrl = `${import.meta.env.VITE_APP_BASE_API}/bill`;
    // 游戏历史数据
    function downGameHistorySum() {
      const url = `${baseUrl}?cmd=downloadSum&gameid=${gameid}&year=${year}&month=${month}&session=${session}`;
      console.log(url);
      downloadXlsxFile(url);
    }
    // 下载支付汇总
    function downloadPaySum() {
      const url = `${baseUrl}?cmd=downloadSum&year=${year}&month=${month}&gameid=${gameid}&session=${session}`;
      downloadXlsxFile(url);
    }
    // 整年游戏汇总账单
    function downloadYearRoundBill() {
      const url = `${baseUrl}?cmd=downloadAllGameSum&year=${year}&searchType=1&session=${session}`;
      downloadXlsxFile(url);
    }
    // 全部游戏汇总账单
    function downloadAllGameSumBill() {
      const url = `${baseUrl}?cmd=downloadAllGameSum&year=${year}&month=${month}&searchType=2&session=${session}`;
      downloadXlsxFile(url);
    }
    // 月份至月份
    function downloadMonthRoundBill() {
      const url = `${baseUrl}?cmd=downloadAllGameSum&startTime=${time?.[0]}&endTime=${time?.[0]}&searchType=3&session=${session}`;
      downloadXlsxFile(url);
    }
    // 全部游戏退款明细
    function downloadAllGameRefund() {
      const url = `${baseUrl}?cmd=downloadRefundList&searchType=2&year=${year}&month=${month}&session=${session}`;
      downloadXlsxFile(url);
    }
    // 整年游戏退款
    function downloadYearRoundGameRefund() {
      const url = `${baseUrl}?cmd=downloadRefundList&searchType=1&session=${session}&year=${year}`;
      downloadXlsxFile(url);
    }
    // 全部游戏微信红包退款明细
    function downloadRefundRedPackList() {
      const url = `${baseUrl}?cmd=downloadRefundRedPackList&year=${year}&month=${month}&session=${session}`;
      downloadXlsxFile(url);
    }
    // 下载对账单
    function downloadBillDetail() {
      const url = `${baseUrl}?cmd=downloadBillDetail&year=${year}&month=${month}&gameid=${gameid}&session=${session}`;
      downloadXlsxFile(url);
    }
    // 红包发放汇总
    function downloadCompanyTransfer() {
      const url = `${baseUrl}?cmd=downloadCompanyTransfer&year=${year}&month=${month}&startTime=${time?.[0]}&endTime=${time?.[0]}&session=${session}`;
      downloadXlsxFile(url);
    }
    // 实名认证抵扣金额明细
    function downloadDiscountBill() {
      const url = `${baseUrl}?cmd=downloadDiscountBill&year=${year}&month=${month}&session=${session}`;
      downloadXlsxFile(url);
    }
    // 抵用券使用明细
    function downloadDiscountCoupon() {
      const url = `${baseUrl}?cmd=downloadDiscountCoupon&year=${year}&month=${month}&session=${session}`;
      downloadXlsxFile(url);
    }
    return {
      downGameHistorySum,
      downloadPaySum,
      downloadYearRoundBill,
      downloadAllGameSumBill,
      downloadMonthRoundBill,
      downloadAllGameRefund,
      downloadYearRoundGameRefund,
      downloadRefundRedPackList,
      downloadBillDetail,
      downloadCompanyTransfer,
      downloadDiscountBill,
      downloadDiscountCoupon
    };
  },
  getMpMarchants() {
    return request.get('/user', {
      cmd: 'getMpMarchants'
    });
  }
};

export const {
  getRegisterInfo,
  getMpMarchants,
  getSum,
  getRegisterList,
  auditRegister,
  downLoadApi
} = commercialApi;
