import React from "react";
import { message, List, Card, Image, Carousel, Tooltip, Button, Space } from "antd";
import Modal from "antd/lib/modal/Modal";
import { LeftCircleFilled, RightCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import { getStaysByHost, deleteStay, getReservationsByStay } from "../utils";

class ReservationList extends React.Component {
  state = {
    loading: false,
    reservations: [],
  };


  componentDidMount() {
    this.loadData();
  }


  loadData = async () => {
    this.setState({
      loading: true,
    });


    try {
      const resp = await getReservationsByStay(this.props.stayId);
      this.setState({
        reservations: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    const { loading, reservations } = this.state;


    return (
      <List
        loading={loading}
        dataSource={reservations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>Guest Name: {item.guest.username}</Text>}
              description={
                <>
                  <Text>Checkin Date: {item.checkInDate}</Text>
                  <br />
                  <Text>Checkout Date: {item.checkOutDate}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}

class ViewReservationsButton extends React.Component {
  state = {
    modalVisible: false,
  };


  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };


  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };


  render() {
    const { stay } = this.props;
    const { modalVisible } = this.state;
    const modalTitle = `Reservations of ${stay.name}`;


    return (
      <>
        <Button onClick={this.openModal} shape="round">
          View Reservations
        </Button>
        {modalVisible && (
          <Modal
            title={modalTitle}
            centered={true}
            visible={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <ReservationList stayId={stay.id} />
          </Modal>
        )}
      </>
    );
  }
}

class RemoveStayButton extends React.Component {
  state = {
    loading: false,
  };


  handleRemoveStay = async () => {
    const { stay, onRemoveSuccess } = this.props;
    this.setState({
      loading: true,
    });


    try {
      await deleteStay(stay.id);
      onRemoveSuccess();
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    return (
      <Button
        loading={this.state.loading}
        onClick={this.handleRemoveStay}
        danger={true}
        shape="round"
        type="primary"
      >
        Remove Stay
      </Button>
    );
  }
}


export class StayDetailInfoButton extends React.Component {

  state = {
    modalVisible: false,
  }

  openModal = () => {
    this.setState({
      modalVisible: true,
    })
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  render() {

    const { stay } = this.props;
    const { name, description, address, guestNumber } = stay;
    const { modalVisible } = this.state;

    return (
      <>
        <Tooltip title="View stay details">
          <Button 
            onClick={ this.openModal }
            style={{border: "none"}}
            size="large"
            icon={<InfoCircleOutlined />}
          />
        </Tooltip>
        {
          modalVisible && (
            <Modal 
              title={name}
              centered="true"
              visible={modalVisible}
              closable="true"
              footer={null}
              onCancel={this.handleCancel}
            >
              <Space direction="vertical">
                <Text strong="true">Description</Text>
                <Text type="secondary">{description}</Text>
                <Text strong="true">Address</Text>
                <Text type="secondary">{address}</Text>
                <Text strong="true">Guest Number</Text>
                <Text type="secondary">{guestNumber}</Text>
              </Space>
            </Modal>
          )
        }
      </>  
    );
  }
}  

class MyStays extends React.Component {
  state = {
    loading: false,
    data: [],
  };


  componentDidMount() {
    this.loadData();
  }


  loadData = async () => {
    this.setState({
      loading: true,
    });


    try {
      const resp = await getStaysByHost();
      this.setState({
        data: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };


  render() {
    return (
      <List
        loading={this.state.loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 3,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={this.state.data}
        renderItem={(item) => (
          <List.Item>
            <Card
              key={item.id}
              title={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Text ellipsis={true} style={{ maxWidth: 150 }}>
                    {item.name}
                  </Text>
                  <StayDetailInfoButton stay={item} />
                </div>
              }
              actions={[<ViewReservationsButton stay={item} />]}
              extra={
                <RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />
              }
            >
              <Carousel
                dots={false}
                arrows={true}
                prevArrow={<LeftCircleFilled />}
                nextArrow={<RightCircleFilled />}
              >
                {item.images.map((image, index) => (
                  <div key={index}>
                    <Image src={image} width="100%" />
                  </div>
                ))}
              </Carousel>
            </Card>
          </List.Item>
        )}
      />
    );
  }
}
export default MyStays;