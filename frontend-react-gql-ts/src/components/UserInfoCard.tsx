import React from 'react';

const UserInfoCard: React.FC<{ username: string }> = ({ username }) => {
    return (
        <div className='col-md-4'>
            <div className='card'>
                <div className='card-body'>
                    <h5 className='card-title'>Welcome, {username}!</h5>
                </div>
            </div>
        </div>
    );
}

export default UserInfoCard;
