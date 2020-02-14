import React, { Component } from 'react';
import { WiredCombo } from 'wired-elements';
import ErrorDialog from "../common/ErrorDialog";

class DsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: true
        }
    }

    componentDidMount() {
        fetch('/ls').then((response) => {
            response.json().then((data) => {
                if (data.success && data.list.length) {
                    this.setState({
                        list: data.list,
                        loading: false
                    });
                } else {
                    ErrorDialog.raise('Error: ' + (data.error || 'Unknown error'))
                }
            }).catch((err) => {
                ErrorDialog.raise('Error parsing json: ' + err.toString())
            })
        }).catch((err) => {
            ErrorDialog.raise('Error fetching data: ' + err.toString())
        })
    }

    render() {
        console.log(this.state)
        const { loading, list } = this.state;

        return <div style={{ margin: '10px' }}>
            <wired-combo disabled={loading ? true : undefined}>
                {list.map(
                    item => <wired-item
                        key={item.id}
                        value={item.id}>{item.name}
                    </wired-item>
                )}
            </wired-combo>
        </div>
    }
}

export default DsList;
