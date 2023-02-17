export namespace Game {
  export type GameCateList = {
    create_time: string;
    id: number;
    title: string;
  };

  export type MuchGame = {
    gameid: number;
    name: string;
    game_url: string;
    create_time: string;
  };

  export type GameList = {
    gameid: number;
    name: string;
    game_url: string;
    create_time: string;
    mch_name: string;
    dayMoney: number;
    developer: string;
  };

  export type GameInfo = {
    delivery_url: string;
    security_key: string;
    game_url: string;
    pay_rate: string;
    mch_id: number;
    gameid: number;
    name: string;
    game_type: number;
    stat_appid: string;
    ext: Array<unknown>;
    hide: number;
    close_pay: number;
    token_type: number;
    orientation: number;
    wx_option: number;
    entry_url: string;
    inner_ext: Array<unknown>;
    content_url: string;
    test_url: string;
    money_name: string;
    money_rate: number;
    use_vucoupon: number;
    publish_type: number;
    publish_time: number;
    create_time: null;
    recommend: number;
    biz_id: string;
    is_bt: number;
    cate_id: number;
  };

  export type GameProduct = {
    total: number;
    page: number;
    list: Array<{
      product_id: number;
      product_name: string;
      cost: number;
      des: string;
      hide: number;
    }>;
  };

  export type GameZone = {
    id: number;
    title: string;
    open_time: string;
  };

  export type SumList = {
    list: Array<{
      [key: string]: {
        list: Array<{
          date: number;
          channel: number;
          money: number;
          channel_name: string;
        }>;
        dayTotal: number;
      };
    }>;
    searchTotal: number;
    historyTotal: string;
  };

  export type CopyrightList = {
    gameid: number;
    name: string;
    url: string;
    certificate_path: string;
    certificate_type: string;
    file_path: string;
    file_type: string;
  };

  export type PayChannel = {
    channel: number;
    channel_name: string;
  };

  export type ChannelMoney = {
    date: string;
    sum: number;
    channel_data: Array<{
      id: number;
      name: string;
      money: number;
    }>;
  };

  export type Order = {
    total: number;
    list: Array<{
      trans_id: number;
      uid: number;
      money: number;
      gameid: number;
      result: number;
      trade_no: string;
      channel: number;
      delivery_result: number;
      trans_time: string;
      notify_time: string;
      product_id: number;
      product_count: number;
      product_name: string;
      game_name: string;
      pay_channel: string;
    }>;
  };
}

export namespace Commercial {
  export interface RegisterList {
    total: number;
    list: Array<{
      nick: string;
      name: string;
      open_user_name: string;
      time: string;
      status: number;
      deal_time: string;
      no: number;
    }>;
  }

  export type CommercialInfo = {
    mch_id: number;
    chid: number;
    name: string;
    create_time: string;
    nick: string;
    target_mch_id: number;
    is_distr: number;
    is_ad: number;
    is_del: number;
    cps_type: number;
  };

  export interface RegisterInfo {
    info: {
      nick: string;
      name: string;
      bank_type: number;
      open_bank_name: string;
      open_user_name: string;
      bank_account: string;
      qq: string;
      mobile: string;
      time: string;
      status: number;
      deal_time: string;
      bank_name: string;
    };
    shangwu: Array<CommercialInfo>;
  }

  export interface MpMarchantsList {
    chid: number;
    cps_type: number;
    create_time: string;
    is_ad: number;
    is_del: number;
    is_distr: number;
    mch_id: number;
    name: string;
    new_num: number;
    nick: string;
    pay_money: number;
    pay_num: number;
    target_mch_id: number;
  }

  export interface MpMarchants {
    name: string;
    sum_data: {
      new_num: number;
      pay_num: number;
      pay_money: number;
    };
    list: Array<MpMarchantsList>;
  }
}

export namespace Cps {
  export type CpsList = {
    gameid: string;
    name: string;
    newUser: number;
    activeUserPayMoney: number;
    newUserPayMoney: number;
    oldUserPayMoney: number;
    avgActive: number;
    activeUser: number;
    avgArpu: number;
    avgArppu: number;
    payUser: number;
    chargeRate: number;
  };

  export type EchartsDate = { [key: string]: number };
  export interface CpsData {
    list: Array<CpsList>;
    total: number;
    incomeByDay: EchartsDate;
    newByDay: EchartsDate;
    activeByDay: EchartsDate;
    sumIncome: number;
    sumActive: number;
    sumNew: number;
  }

  export type CpsRankList = any;
}

export namespace User {
  export interface Verify {
    challenge: string;
    gt: string;
    success: number;
  }

  type SessdataType = {
    nick: string;
    login_time: number;
    roleid: number;
    name: string;
    mchid: number;
    is_ad: number;
    is_distr: number;
    target_mch_id: number;
    gameids: Array<number>;
  };

  export type LoginType = {
    session: string;
    sessdata: SessdataType;
  };

  export type UserMenu = {
    value: number;
    pid: number;
    label: string;
    id: number;
    children: Array<UserMenu>;
  };

  export type Role = {
    brief: string;
    create_time: string;
    id: number;
    name: string;
  };

  export type RoleList = {
    menuList: Array<UserMenu>;
    roleList: Array<Role>;
  };
}

export namespace Menu {
  export interface MenuList {
    id: number;
    title: string;
    path: string;
    pid: number;
    icon: string;
    component: string;
    redirect: string;
    keepAlive: number;
    hidden: number;
    type: number;
    sort: number;
    create_time: string;
    update_time: string;
    children: Array<MenuList>;
  }
}

export namespace Stat {
  export interface AllPlatformOnline {
    m_data: Array<{
      gameid: number;
      game_name: string;
      count: number;
      time: number;
    }>;
    s_data: Array<{
      gameid: number;
      game_name: string;
      data: Record<string, number>;
    }>;
  }

  export type PlatformDataList = {
    active: number;
    awy_active: number;
    date: number;
    wanba_active: number;
    yyb_active: number;
  };
}
