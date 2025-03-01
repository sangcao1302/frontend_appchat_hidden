import React, { useEffect, useState } from 'react';
import './Policy.css'; // Optional: Create a CSS file for styling
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Policy = () => {
    const navigate = useNavigate();
  
    const [checked, setChecked] = useState("false");
    const handleCheck = () => {
        setChecked("true")
    };
    const handleSubmit = () => {
        if (checked==="true") {
            localStorage.setItem('policyAccepted', checked);
            navigate('/chat'); // Navigate only if checked
        } 
       
    };   
    return (
        <div className="terms-container">
            <h1>Điều Khoản Sử Dụng</h1>
            <p>Chào mừng bạn đến với ứng dụng chat của chúng tôi. Vui lòng đọc kỹ các điều khoản sử dụng dưới đây trước khi sử dụng ứng dụng.</p>

            <h2>1. Chấp Nhận Điều Khoản</h2>
            <p>Bằng cách sử dụng ứng dụng này, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng được quy định dưới đây.</p>

            <h2>2. Quyền Sử Dụng</h2>
            <p>Bạn được cấp quyền sử dụng ứng dụng này cho mục đích cá nhân và không thương mại. Bạn không được phép sao chép, phân phối hoặc sử dụng ứng dụng cho bất kỳ mục đích thương mại nào mà không có sự đồng ý bằng văn bản từ chúng tôi.</p>

            <h2>3. Trách Nhiệm Người Dùng</h2>
            <p>Bạn chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của mình. Bạn cam kết không sử dụng ứng dụng để thực hiện các hành vi vi phạm pháp luật, quấy rối, lừa đảo hoặc gây hại cho người khác.</p>

            <h2>4. Bảo Mật Thông Tin</h2>
            <p>Chúng tôi cam kết bảo mật thông tin cá nhân của bạn. Tuy nhiên, bạn cũng cần bảo vệ thông tin tài khoản của mình và không chia sẻ với người khác.</p>

            <h2>5. Giới Hạn Trách Nhiệm</h2>
            <p>Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng dụng này. Điều này bao gồm nhưng không giới hạn ở các thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả.</p>
            <p>Chúng tôi không chịu trách nhiệm về bất kỳ sự cố nào xảy ra ngoài ứng dụng, bao gồm nhưng không giới hạn ở các cuộc gặp gỡ trực tiếp giữa người dùng.</p>

            <h2>6. Thay Đổi Điều Khoản</h2>
            <p>Chúng tôi có quyền thay đổi các điều khoản sử dụng này bất kỳ lúc nào. Các thay đổi sẽ được cập nhật trên ứng dụng và có hiệu lực ngay khi được đăng tải.</p>

            <h2>7. Liên Hệ</h2>
            <p>Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua email: support@example.com.</p>

            <p>Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi!</p>
            <div className="form-check form-check-inline mt-2 d-flex align-items-center">
                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" onClick={(handleCheck)}/>
                <label className="form-check-label fw-bold fs-5 mx-2" htmlFor="inlineCheckbox1">Tôi đã đọc và đồng ý với tất cả điều khoản</label>
            </div>
            <button type="button" className="btn btn-danger mt-3" disabled={!checked} onClick={handleSubmit} >Chấp nhận</button>
        </div>
        
    );
};

export default Policy;