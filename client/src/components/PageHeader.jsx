function PageHeader({ title, subtitle }) {
    return (
        <div>
            <h1>
                {title}
            </h1>

            <p className="sub">
                {subtitle}
            </p>
        </div>
    );
}

export default PageHeader;