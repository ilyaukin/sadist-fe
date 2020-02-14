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

        // wired-combo does not have react-native events, so doing this way
        this.combo.addEventListener('selected', (e) => this.onDsSelected(e, e.detail?.selected))
    }

    onDsSelected(event, value) {
        console.log(value)
    }

    render() {
        console.log(this.state)
        const { loading, list } = this.state;

        return <div style={{ margin: '10px' }}>
            <wired-combo disabled={loading ? true : undefined} ref={(combo) => this.combo = combo}>
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
