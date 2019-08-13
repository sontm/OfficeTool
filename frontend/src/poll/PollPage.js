import React, { Component } from 'react';
import LoadingIndicator  from '../common/LoadingIndicator';
import { DatePicker, Modal, Button, Icon, Collapse, notification, Card, 
    Select, Form, Radio, Input} from 'antd';
import { withRouter } from 'react-router-dom';
import {getMatchTeamIDOfUser} from '../util/Helpers'

import PollList from './PollList'
import NewPoll from './NewPoll'

const { Option } = Select;
const FormItem = Form.Item;
const { Panel } = Collapse;

class PollPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModalAdd: false,
            idTogglePollReload: 1
        };

        this.handleNewPollBtn = this.handleNewPollBtn.bind(this)
        this.handleCancelAdd = this.handleCancelAdd.bind(this)
        this.onPollCreated = this.onPollCreated.bind(this)
    }

    handleCancelAdd() {
        this.setState({
            isOpenModalAdd: false
        })
    }

    handleNewPollBtn() {
        this.setState({
            isOpenModalAdd: true
        })
    }

    onPollCreated() {
        this.setState({
            isOpenModalAdd: false,
            idTogglePollReload: this.state.idTogglePollReload + 1
        })
        // idTogglePollReload increaase, with key, PollList will reload
    }
    render() {
        return (
        <React.Fragment>
            <Button type="primary" style={{marginLeft: "50px"}}
                size="large" onClick={this.handleNewPollBtn}>
                New Poll
            </Button>
            <br/><br/>
            <PollList  {...this.props} key={this.state.idTogglePollReload} />
            <Modal
                    title="New Poll"
                    visible={this.state.isOpenModalAdd}
                    onCancel={this.handleCancelAdd}
                    footer={null}
                    >
                <NewPoll {...this.props} onPollCreated={this.onPollCreated}/>
            </Modal>
        </React.Fragment>
        );
    }
}

export default withRouter(PollPage);
