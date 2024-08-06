import React from 'react';
import { Tabs } from "antd";
import UploadStay from './UploadStay';
import MyStays from './MyStays';

const { TabPane } = Tabs;

class HostPage extends React.Component {
  render() {
    return (
      <Tabs defaultActiveKey='1' destroyInactiveTabPane={true}>
        <TabPane key="1" tab="My Stays">
          <MyStays />
        </TabPane>
        <TabPane key="2" tab="Upload stay">
          <UploadStay />
        </TabPane>
      </Tabs>
    );
  };
};

export default HostPage;